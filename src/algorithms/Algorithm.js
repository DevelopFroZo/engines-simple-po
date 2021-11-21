const weightFunctions = require( "./weightFunctions" );
const markFunctions = require( "./markFunctions" );

class Algorithm {
  constructor(
    data,
    {
      markFunction = "x",
      weightFunction = "absoluteDistance",
      isMark = true,
      isDirected = false,
      isRemoveDuplicate = true,
      algorithmParameters = []
    } = {}
  ){
    if( Array.isArray( data ) ){
      this.series = data;

      if( isMark ){
        this.markData( markFunction );
      }
    } else {
      this.series = data.series;
    }

    this.edges = [];

    this.setWeightFunction( weightFunction );
    this.setIsDirected( isDirected );
    this.setIsRemoveDuplicate( isRemoveDuplicate );
    this.setAlgorithmParameters( algorithmParameters );
  }

  static execute( data, settings ){
    const algorithm = new this( data, settings );

    algorithm.execute();

    return algorithm.getFullData();
  }

  setWeightFunction( weightFunction ){
    if( weightFunction === "none" ){
      this.weightFunction = null;
    }
    else if( typeof weightFunction === "string" ){
      this.weightFunction = weightFunctions[ weightFunction ];
    } else {
      this.weightFunction = weightFunction;
    }
  }

  setIsDirected( isDirected ){
    this.isDirected = isDirected;
  }

  setIsRemoveDuplicate( isRemoveDuplicate ){
    this.isRemoveDuplicate = isRemoveDuplicate;

    if( isRemoveDuplicate ){
      this.uniqueIdx = [];
    }
  }

  setAlgorithmParameters( algorithmParameters ){
    this.algorithmParameters = algorithmParameters;
  }

  getFullData(){
    return {
      series: this.series,
      edges: this.edges
    };
  }

  markData( markFunction ){
    let markFunction_;

    if( typeof markFunction === "string" ){
      markFunction_ = markFunctions[ markFunction ];
    } else {
      markFunction_ = markFunction;
    }

    this.series = this.series.map( ( row, i ) => {
      const label = markFunction_( row, i );

      return [ ...row, label ];
    } );
  }

  makeEdge( s0, s1 ){
    const [ ,,label0 ] = s0;
    const [ ,,label1 ] = s1;

    if( this.isRemoveDuplicate ){
      const key0 = `${label0}_${label1}`;
      const key1 = `${label1}_${label0}`;

      if(
        this.uniqueIdx.includes( key0 ) ||
        this.uniqueIdx.includes( key1 )
      ) return;

      this.uniqueIdx.push( key0 );
    }

    const edge = {
      source: label0,
      target: label1
    };

    if( this.weightFunction ){
      edge.weight = this.weightFunction( s0, s1 );
    }

    this.edges.push( edge );
  }

  execute(){}
}

module.exports = { Algorithm };