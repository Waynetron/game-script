import {matches, mergeWith, isNumber} from 'lodash-es';
import {
  parseRules, parseSprites, parseLegend, parseLevel, parseAssets,
  getLevelDimensions, ruleToStateTransition
} from '../Parse/util.js';
import {
  storePreviousPosition, applyAcceleration, applyVelocity, applyFriction,
  applySpriteCollisions, applySpriteCollisionsCrossMethod, applyWallCollisions,
  resetTouching
} from './physics';
import {TILE_SIZE} from '../Game/constants.js'

const defaultState = {
  sprites: [],
  legend: {},
  names: {},
  rules: [],
  stateTransitions: [],
  assets: [],
  width_in_tiles: 0,
  height_in_tiles: 0,
  elapsed: {
    sinceLastFrame: 0,
    totalFrames: 0
  },
  active: false
};

const containsState = (state, sprite)=> {
  for (const entry of Object.entries(state)) {
    const [key, val] = entry;
    if (sprite[key] !== val) {
      return false;
    }
  }

  return true;
}

const mergeStates = (initialState, newState)=> {
  let merged = {...initialState};

  for (const key of Reflect.ownKeys(newState)) {
    // Both states contain key, add them together and use that
    if (merged[key]) {
      merged[key] = {
        x: initialState[key].x + newState[key].x,
        y: initialState[key].y + newState[key].y
      }
    }
    // initialState did not contain this key, so copy the whole thing from newState
    else {
      merged[key] = {...newState[key]};
    }
  }

  return merged;
};

// custom merge rules
const mergeCustomizer = (objValue, srcValue)=> {
  if (isNumber(objValue)) {
    return objValue + srcValue;
  }
}

const applyStateTransition = (sprite, transitions)=> {
  let resultState = {...sprite};

  for (const transition of transitions) {
    const [left, right] = transition;

    if (matches(left)(sprite)) {
      resultState = mergeWith(resultState, right, mergeCustomizer)
    }
  }

  return resultState;
};

const arrayToObject = (array) =>
   array.reduce((obj, item) => {
     obj[item] = true
     return obj
   }, {})

const gameReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE':
      return {...state, active: action.active}
      
    case 'UPDATE_CODE':
      return {...state, code: action.code}

    case 'COMPILE':
      const {code} = action;
      const level = parseLevel(code);
      const legend = parseLegend(code);
      // names is the legend mapped to have the values as keys. Used for fast name lookup.
      const names = arrayToObject(Object.values(legend));
      const assets = parseAssets(code);
      const sprites = parseSprites(level, legend, assets);
      
      const rules = parseRules(code);
      // A rule consists of a before and an after state referred to as a state transition
      const stateTransitions = rules.map((rule)=> ruleToStateTransition(rule, names)); // [leftState, rightState]

      const [width_in_tiles, height_in_tiles] = getLevelDimensions(level);

      return {
        ...defaultState,
        sprites,
        legend,
        names,
        rules,
        stateTransitions,
        assets,
        width: width_in_tiles * TILE_SIZE,
        height: height_in_tiles * TILE_SIZE,
      }

    case 'UPDATE_ELAPSED':
      const {elapsed} = action;
      const previousState = {...state};
      return {
          ...state,
          // Using object with a frame counter inside the object to make sure
          // it always rerenders when used in components
          // My thinking is that if I just use elapsed, then it's possible for the same elapsed value
          // to fire twice in a row, and the 2nd render might not be called (optimised away)
          elapsed: {
            sinceLastFrame: Date.now() - elapsed,
            totalFrames: state.elapsed.totalFrames + 1
          },
          sprites: state.sprites.map((sprite)=> (
              sprite
                |> resetTouching
                |> storePreviousPosition
                |> ((sprite) => applyStateTransition(sprite, state.stateTransitions))
                |> applyAcceleration
                |> applyVelocity
                |> (sprite => applySpriteCollisionsCrossMethod(sprite, state.sprites, previousState))
                |> (sprite => applySpriteCollisions(sprite, state.sprites, previousState))
                |> (sprite => applyWallCollisions(sprite, state.width, state.height))
                |> applyFriction
            )
          )
      }
    case 'SET_INPUT':
      return {
        ...state,
        sprites: state.sprites.map(
          (sprite)=> ({...sprite, inputs: {...sprite.inputs, [action.input]: true}})
        )
      };

    case 'CANCEL_INPUT':
      return {
        ...state,
        sprites: state.sprites.map(
          (sprite)=> {
            const newInputs = {...sprite.inputs};
            newInputs[action.input] = undefined;
            return {...sprite, inputs: newInputs}
          }
        )
      };

    default:
      return state
  }
}

export default gameReducer