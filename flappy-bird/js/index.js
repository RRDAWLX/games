let images = [
  {
    name: 'bird',
    url: './image/bird.png'
  },
  {
    name: 'ground',
    url: './image/ground.png'
  },
  {
    name: 'number',
    url: './image/number.png'
  },
  {
    name: 'over',
    url: './image/over.png'
  },
  {
    name: 'pipe',
    url: './image/pipe.png'
  },{
    name: 'ready',
    url: './image/ready.png'
  },
];

loadImages(images).then(res => {
  new Game(res[0]).getReady();
});

function loadImages(imagesArr) {
  let images = {},
    promises = [];
  imagesArr.forEach(image => {
    let promise = new Promise(resolve => {
      let imgElement = document.createElement('img');
      imgElement.onload = () => {
        images[image.name] = imgElement;
        resolve(images);
      };
      imgElement.src = image.url;
    });
    promises.push(promise);
  });

  return Promise.all(promises);
}
