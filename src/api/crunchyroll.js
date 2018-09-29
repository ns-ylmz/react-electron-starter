// npm packages
import axios from 'axios';
import cheerio from 'cheerio';
import path from 'path';
// import electron from 'electron';
const electron = window.require('electron');
const fs = window.require('fs');
const { spawn } = window.require('child_process');
// import fs from 'fs';
// import { spawn } from 'child_process';

// our packages
import db from '../db';

// base url used for most requests
const baseURL = 'http://www.crunchyroll.com';

// folder for videos
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const targetFolder = path.join(userDataPath, 'crunchyroll');

try {
    fs.accessSync(targetFolder);
} catch (error) {
    fs.mkdirSync(targetFolder);
}

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

    getEpisode:  (episode) => {
        console.log('loading episode: ', episode);
        const dl = spawn('youtube-dl', [episode.url], { cwd: targetFolder });
        dl.stdout.on('data', data => {
            console.log('youtube-dl data', data.toString());
        });
        dl.stderr.on('data', data => {
            console.log('youtube-dl error', data.toString());
        });
    },

    getMySeries: () => {

    },

    search: (query) => {

    }
}