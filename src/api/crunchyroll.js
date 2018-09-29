// npm packages
import axios from 'axios';
import cheerio from 'cheerio';

// our packages
import db from '../db';

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
                const id = a.attr('href');
                const url = `${baseURL}${id}`;
                // get images
                const img = $('img', element);
                const image = img.attr('src');
                // get videos count
                const seriesData = $('.series-data', element);
                const count = parseInt(seriesData.text().trim().replace('Videos', '').trim(), 10);
                // return series data
                return {
                    count,
                    id,
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
                    const id = $('a.episode', element).attr('href');
                    const url = `${baseURL}${id}`;
                    const img = $('img', element);
                    const image = img.attr('src') || img.attr('data-thumbnailUrl');
                    const title = $('.series-title', element).text().trim();
                    const description = $('.short-desc', element).text().trim();
                return {
                    id,
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

    getEpisode:  (episode) => {

    },

    getMySeries: () => {

    },

    search: (query) => {

    }
}