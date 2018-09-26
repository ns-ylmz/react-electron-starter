// npm packages
// const axios = require('axios');
// const cheerio = require('cheerio');
import axios from 'axios';
import cheerio from 'cheerio';

// base url used for most requests
const baseURL = 'http://www.crunchyroll.com';

// main module
export const Crunchyroll = {
    async getAllSeries(page = 0) {
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
                const url = `${baseURL}${a.attr('href')}`;
                // get images
                const img = $('img', element);
                const image = img.attr('src');
                // get videos count
                const seriesData = $('.series-data', element);
                const count = parseInt(seriesData.text().trim().replace('Videos', '').trim(), 10);
                // return series data
                return {
                    title,
                    url,
                    image,
                    count
                };
            }).get();
            
            return series;
    },

    getEpisodes(series) {

    },

    getEpisode(episode) {

    },

    getMySeries() {

    },

    search(query) {

    }
}