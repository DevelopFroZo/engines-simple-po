import serial.tools.list_ports
import serial
import requests

url = 'http://localhost:3000'

def portFilterPredicate( description ):
  return 'arduino' in description.lower()

def index():
  ports = serial.tools.list_ports.comports()
  ports = list( filter( lambda port: portFilterPredicate( port.description ), ports ) )

  if len( ports ) == 0:
    print( 'Arduino not connected' )

    return

  port = serial.Serial( port = ports[0].device )

  if not port.is_open:
    print( 'Port not opened' )

    return

  buffer = ''
  isNeedRead = True
  i = 1

  print( f'Port detected ({ports[0].description}). Wait for data...' )

  while True:
    size = port.inWaiting()

    if isNeedRead and size > 0:
      data = port.read( size ).decode( 'utf8' ).replace( '\r', '' ).replace( '\n', ' ' )
      buffer += data

      print( 'Recieved part of data' )

    if 'START' in buffer and 'END' in buffer:
      isNeedRead = False
      rawData = buffer.strip().split( ' ' )[ 1:-1 ]
      data = []

      for i, el in enumerate( rawData ):
        data.append( [ i + 1, float( el ) ] )

      print( 'Recieved complete data', data )

      buffer = ''
      response = requests.post( f'{url}/api/algorithm', json = data )
      isNeedRead = True

      print( f'[{response.status_code}] {response.reason}' )

if __name__ == '__main__':
  index()