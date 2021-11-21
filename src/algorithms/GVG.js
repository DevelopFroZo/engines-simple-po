const { Algorithm } = require( "./Algorithm" );

class GVG extends Algorithm {
  execute(){
    const [ windowsCount = 1 ] = this.algorithmParameters;
    const seriesLength = this.series.length;

    for( let i = 0; i < seriesLength - 1; i++ ){
      this.makeEdge( this.series[i], this.series[ i + 1 ] );
    }

    const seriesSorted = this.series.sort( ( [ ,y0 ], [ ,y1 ] ) => {
      if( y0 > y1 ) return -1;
      if( y0 < y1 ) return 1;

      return 0;
    } );

    const windowSize = ( seriesSorted[0][1] - seriesSorted[ seriesLength - 1 ][1] ) / windowsCount;
    let border = seriesSorted[0][1] - windowSize;
    let group = [];

    for( const s0 of seriesSorted ){
      const [ ,y ] = s0;

      if( y < border ){
        group = [];
        border -= windowSize;
      }

      if( group.length > 0 ){
        for( const s1 of group ){
          this.makeEdge( s0, s1 );
        }
      }

      group.push( s0 );
    }
  }
}

module.exports = { GVG };