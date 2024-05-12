const express = require('express');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');

const service = require('../service/currency');

const router = express.Router();

const myCache = new NodeCache({ stdTTL: 6000 }); // Cache for 100 minutes

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply the rate limiting middleware to all requests
router.use(limiter);

function fetchData(fetchFunction, cacheKey) {
    return new Promise((resolve, reject) => {
        let data = myCache.get(cacheKey);
        if (data) {
            resolve(data);
        } else {
            fetchFunction().then(data => {
                myCache.set(cacheKey, data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        }
    });
}

import('queue').then(queueModule => {
    const Queue = queueModule.default;
    const apiQueue = new Queue({ concurrency: 1, autostart: true });

    // Endpoint to get currency data from page number with per page count
    // /api/currencies/{page_num},{per_page_count}
    router.get('/currencies/:page_num,:per_page_count', (req, res) => {
        const { page_num, per_page_count } = req.params;
        const cacheKey = `page-${page_num}-${per_page_count}`;

        apiQueue.push(() => {
            return fetchData(() => service.getByPage(page_num, per_page_count), cacheKey)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Internal server error', details: error.message });
                });
        });
    });
    
    // Endpoint to get currency data by id
    // /api/currency/{id}
    router.get('/currency/:id', (req, res) => {
        const id = req.params.id;
        const cacheKey = `id-${id}`;

        apiQueue.push(() => {
            return fetchData(() => service.getById(id), cacheKey)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Internal server error', details: error.message });
                });
        });
    });
}).catch(error => {
    console.error('Error loading module:', error);
});
  
module.exports = router;
