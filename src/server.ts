import { promises } from "fs";
import { createServer } from "http";

import express from "express";
import { Server as SocketIoServer } from "socket.io";
import cors from "cors";

const { GVG } = require( "./algorithms" );

const calibrationDataPath = "calibration.json";
const algorithmData = [ 20 ];

async function getCalibrationData( path: string ): Promise<[number | null, number | null]>{
  try{
    const { good, bad } = JSON.parse( await promises.readFile( path, "utf8" ) );

    return [ good, bad ];
  } catch( e ) {
    return [ null, null ];
  }
}

function getDelta( good: number | null, bad: number | null ): number | null{
  if( good !== null && bad !== null ){
    return bad - good;
  }

  return null;
}

async function index(){
  const PORT = process.argv[2] || 3000;
  let [ good, bad ] = await getCalibrationData( calibrationDataPath );
  let delta = getDelta( good, bad );

  const app = express();
  const server = createServer( app );

  const io = new SocketIoServer( server, {
    cors: {
      origin: "*"
    }
  } );

  app.use(
    express.static( "static", {
      extensions: [ "html" ]
    } ),
    cors(),
    express.json(),
    express.urlencoded( {
      extended: true
    } )
  );

  app.get( "/api/calibration", ( {}, res ) => {
    res.json( { good, bad } );
  } );

  app.post( "/api/calibration", async ( { body: { good: good_, bad: bad_ } }, res ) => {
    if( !isNaN( good_ ) && typeof( good_ ) === "number" ){
      good = good_;
    }

    if( !isNaN( bad_ ) && typeof( bad_ ) === "number" ){
      bad = bad_;
    }

    await promises.writeFile( calibrationDataPath, JSON.stringify( { good, bad } ) );
    delta = getDelta( good, bad );

    res.json( { good, bad } );
  } );

  app.post( "/api/algorithm", ( { body }, res ) => {
    console.debug( "> \x1b[36m[\x1b[35mDEBUG\x1b[36m] Recieved data\x1b[0m" );

    const network = GVG.execute( body, algorithmData );
    const edgesCount = network.edges.length;
    let coeff;

    if( typeof( good ) === "number" && typeof( delta ) === "number" ){
      coeff = 1 - ( edgesCount - good ) / delta;
    } else {
      coeff = null;
    }

    io.emit( "algo", [ edgesCount, coeff ] );

    console.debug( `> \x1b[36m[\x1b[35mDEBUG\x1b[36m] Sending result (${edgesCount}, ${coeff})\x1b[0m` );

    res.sendStatus( 200 );
  } );

  io.on( "connect", socket => {
    console.info( "> \x1b[36m[\x1b[35mINFO\x1b[36m] Socket connected\x1b[0m" );

    socket.on( "disconnect", () => {
      console.info( "> \x1b[36m[\x1b[35mINFO\x1b[36m] Socket disconnected\x1b[0m" );
    } );
  } );

  server.listen( PORT, () => {
    console.log( `> \x1b[36mStarted server on port \x1b[35m${PORT}\x1b[0m` );
  } );
}

index();

export default index;