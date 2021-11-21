# Starting server
From project folder:
1. `npm i` - install dependencies
2. `npx tsc` - build typescript to javascript
3. `node build\server [port]` - run server. **DEFAULT PORT IS 3000**. Run on 8000 port (example): `node build\server 8000`

# Read from COM-port using python script
1. `pip install pyserial` - install `pyserial` lib
2. `py read-from-com-port.py` - run script

Script will auto-detect the port and listen data on it.