// npm packages
import axios from 'axios';
import cheerio from 'cheerio';
import querystring from 'querystring';
import { M3U } from 'playlist-parser';
//import * as electron from 'electron';

// our packages
import db from '../../db';
import parseXml from './parseXml';
import decode from './subtitles/index';
import bytesToAss from './subtitles/ass';

// base url used for most requests
const baseURL = 'http://www.crunchyroll.com';

// main module
export const Crunchyroll = {
    getAllSeries: async (page = 0) => {
        // load catalogue
        const { data } = await axios.get(`${baseURL}/videos/anime/populer/ajax_page?pg=${page}`);
        // create cheerio cursor
        const $ = cheerio.load(data);

        const series = $('li.group-item')
            .map((index, el) => {
                const element = $(el);
                const a = $('a', element);
                // get title & url
                const title = a.attr('title');
                const _id = a.attr('href');
                const url = `${baseURL}${_id}`;
                // get images
                const img = $('img', element);
                const image = img.attr('src');
                // get videos count
                const seriesData = $('.series-data', element);
                const count = parseInt(seriesData.text().trim().replace('Videos', '').trim(), 10);
                // return series data
                return {
                    count,
                    _id,
                    image,
                    source: 'crunchyroll',
                    title,
                    url
                };
            }).get();
            // store in the db
            await db.series.bulkDocs(series);

            return series;
    },

    getEpisodes: async (series) => {
        // load episodes
        const { data } = await axios.get(series.url);
        // create cheerio cursor
        const $ = cheerio.load(data);
        const episodesContainer = $('.list-of-seasons ul.portrait-grid');
        const episodes = $('.group-item', episodesContainer)
            .map((index, el) => {
                    const element = $(el);
                    const _id = $('a.episode', element).attr('href');
                    const url = `${baseURL}${_id}`;
                    const img = $('img', element);
                    const image = img.attr('src') || img.attr('data-thumbnailUrl');
                    const title = $('.series-title', element).text().trim();
                    const description = $('.short-desc', element).text().trim();
                return {
                    _id,
                    url,
                    image,
                    title,
                    description
                };
            })
            .get();
            // store in the db
            await db.episodes.bulkDocs(episodes);

            return episodes;
    },

    getEpisode:  async (episode) => {
        // load episode page
        const { data } = await axios.get(episode.url);
        // load into cheerio
        const $ = cheerio.load(data);
        // find available formats
        const formats = [];

        $('a[token^=showmedia]').each((index, el) => {
            const token = $(el).attr('token');
            if (!token.includes('showmedia.')) return;
            const formatId = token.replace('showmedia.', '').replace(/p$/, '');
            formats.push(formatId);
        });

        const format = formats[0] || '480p';
        const idRegex = /([0-9]+)$/g;
        const idMatches = idRegex.exec(episode.url);
        const id = idMatches[0];

        const xmlUrl = `http://www.crunchyroll.com/xml/?req=RpcApiVideoPlayer_GetStandardConfig&media_id=${id}&video_format=${format}&video_quality=${format}`;
        const { data: xmlData } = await axios({
            url: xmlUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: querystring.stringify({
                current_page: episode.url
            })
        });

        const xmlObj = await parseXml(xmlData);
        const preload = xmlObj['config:Config']['default:preload'][0];
        const subtitlesInfo = preload.subtitles[0].subtitle;
        const streamInfo = preload.stream_info[0];
        const streamFile = streamInfo.file[0];

        // load stream urls playlist
        const { data: streamFileData } = await axios.get(streamFile);
        const playlist = M3U.parse(streamFileData);

        // get subtitles
        const englishSubs = subtitlesInfo.map(s => s.$).filter(s => s.title.includes('English')).pop();
        const { data: subData } = await axios(englishSubs.link);
        const subsObj = await parseXml(subData);
        const subsId = parseInt(subsObj.subtitle.$.id, 10);
        const subsIv = subsObj.subtitle.iv.pop();
        const subsData = subsObj.subtitle.data.pop();

        const subBytes = await decode(subsId, subsIv, subsData);
        const subtitlesText = await bytesToAss(subBytes);
        const subBlob = new Blob([subtitlesText], {
            type: 'application/octet-binary',
        });

        // construct response
        const subtitles = URL.createObjectURL(subBlob);
        const url = playlist.pop().file;
        const type = 'application/x-mpegURL';

        return { type, url, subtitles };
    },

    getMySeries: () => {

    },

    search: (query) => {

    }
}