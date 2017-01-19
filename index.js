const Hs100Api = require('hs100-api');
const client = new Hs100Api.Client({ broadcast: '192.168.1.255' });
const express = require('express');
const app = express();
let plugs = [];

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  if (plugs.length > 0) return res.render('index', { plugs });
  // Look for plugs
  client.startDiscovery().on('plug-new', (plug) => {
    plug.getPowerState().then(state => {
      plug.getInfo().then(info => {
        info.ip = plug.host;
        info.state = state;
        plugs.push(info);
        res.render('index', { plugs });
      });
    });
  });
});

app.get('/ip/:ip', (req, res) => {
  // Look for plugs and change their state
  const plug = client.getPlug({host: req.params.ip})
  plug.getPowerState()
    .then(state => {
      plug.setPowerState(!state);
      res.json({ip: req.params.ip, state: !state});
    }).catch(err => {
      plugs = plugs.filter(plug => plug.ip != req.params.ip);
      res.status(410).send(err);
    });
});

app.get('/reset', (req, res) => {
  plugs = plugs.slice();
  res.redirect('/');
})

app.use(function (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
});

app.listen(3000);
