import React from 'react';
import Sprite from './Sprite.js';
import styled, {css} from 'styled-components'

const Stage = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: var(--dark-color);
  overflow: hidden;

  ${props => props.shake && css`
      transform: translate3d(
        ${Math.random() * 4 - 2}px,
        ${Math.random() * 4 - 2}px,
        0px
      )
  `}
`

const Game = ({sprites, width, height, shake, availableImages, imageMap, error, debug})=> (
  <Stage width={width} height={height} shake={shake}>
    {error && <p className='error' >{error}</p>}
    {sprites.map((sprite)=>
      <Sprite
        key={sprite.id}
        x={sprite.position.x}
        y={sprite.position.y}
        imageName={sprite.name}
        letter={sprite.letter}
        imageMap={imageMap}
        availableImages={availableImages}
        
        // debug visualisation
        sprite={sprite}
        debug={debug}
      />
    )}
  </Stage>
);

export default Game