  function toggleState (evt) {
    const ip = evt.currentTarget.getAttribute('ip');
    const light = document.querySelector(`.status[ip="${ip}"]`);
    light.classList.add('status--pending');
    fetch(`/ip/${ip}`).then(response => response.json().then(json => {
      light.classList = json.state ? 'status status--on' : 'status';
    })).catch(console.error);
  }

  document.querySelector('.status').addEventListener('click', toggleState);
