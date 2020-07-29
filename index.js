const express = require('express');
const request = require('request');

//todo add form to add and remove server
const servers = ['http://localhost:9090', 'http://localhost:9091', 'http://localhost:9092', 'http://localhost:9093' ];
let cur = 0;

const handler = (req, res) => {
  // Pipe the vanilla node HTTP request (a readable stream) into `request`
  // to the next server URL. Then, since `res` implements the writable stream
  // interface, you can just `pipe()` into `res`.

  const _request = request({ url: servers[cur] + req.url })
  .on('response', res =>{
    //todo add timestamp and add result to stats object
    console.log('success');
    console.log(res.request.href)
  })
  .on('error', error=>{
    
    res.status(500).send(error.message);
  })

  req.pipe(_request).pipe(res)
  cur = (cur + 1) % servers.length;
};
const server = express().get('*', handler).post('*', handler);

server.listen(8080);