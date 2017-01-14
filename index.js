const Hs100Api = require('hs100-api');
const client = new Hs100Api.Client({ broadcast: '192.168.1.255' });
const express = require('express');
const app = express();

// function transform
app.set('views', './views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  // Look for plugs
  client.startDiscovery().on('plug-new', (plug) => {
    plug.getPowerState().then(state => {
      plug.getInfo().then(info => {
        info.ip = plug.host;
        info.state = state;
        res.render('index', { info });
      });
    });
  });
});

app.get('/ip/:ip', (req, res) => {
  // Look for plugs and change their state
  const plug = client.getPlug({host: req.params.ip});
  plug.getPowerState().then(state => {
    plug.setPowerState(!state);
    res.json({ip: req.params.ip, state: !state});
  }); 
});

app.listen(3001);