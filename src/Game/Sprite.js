import React from 'react';
import './Sprite.css';

const safelyLoadSrc = (img)=> {
  const images = ['player', 'brick', 'question-brick', 'spike', 'goomba'];
  return images.includes(img)
    ? require(`./images/${img}.png`)
    : null
};

const getPositionStyle = (x, y)=> ({
  position: 'relative', left: x, top: y
});

const Sprite = ({x, y, img})=> (
  <div className="sprite" style={getPositionStyle(x, y)}>
    <img src={safelyLoadSrc(img)} alt='' />
  </div>
);

export default Sprite;