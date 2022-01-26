/**
 * Convert absolute CSS numerical values to pixels.
 *
 * @link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#numbers_lengths_and_percentages
 *
 * @param {string} cssValue
 * @param {null|HTMLElement} target Used for relative units.
 * @return {*}
 */
export const convertCssUnit = function( cssValue, target ) {

  target = target || document.body;

  const supportedUnits = {

    // Absolute sizes
    'px': value => value,
    'cm': value => value * 38,
    'mm': value => value * 3.8,
    'q': value => value * 0.95,
    'in': value => value * 96,
    'pc': value => value * 16,
    'pt': value => value * 1.333333,

    // Relative sizes
    'rem': value => value * parseFloat( getComputedStyle( document.documentElement ).fontSize ),
    'em': value => value * parseFloat( getComputedStyle( target ).fontSize ),
    'vw': value => value / 100 * window.innerWidth,
    'vh': value => value / 100 * window.innerHeight,
    'vmax': value => value / 100 * Math.max(window.innerWidth, window.innerHeight),
    'vmin': value => value / 100 * Math.min(window.innerWidth, window.innerHeight),

    // Times
    'ms': value => value,
    's': value => value * 1000,

    // Angles
    'deg': value => value,
    'rad': value => value * ( 180 / Math.PI ),
    'grad': value => value * ( 180 / 200 ),
    'turn': value => value * 360

  };

  // Match positive and negative numbers including decimals with following unit
  const pattern = new RegExp( `^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${ Object.keys( supportedUnits ).join( '|' ) })$`, 'i' );

  // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]
  const matches = String.prototype.toString.apply( cssValue ).trim().match( pattern );

  if ( matches ) {
    const value = Number( matches[ 1 ] );
    const unit = matches[ 2 ].toLocaleLowerCase();

    // Sanity check, make sure unit conversion function exists
    if ( unit in supportedUnits ) {
      return supportedUnits[ unit ]( value );
    }
  }

  return cssValue;

};