import io from 'socket.io-client';

const useSocket = () => {
  const socket = io('http://158.247.214.79');
  socket.on('connection', () => {
    console.log('you are connected');
  });

  return socket;
};

export default useSocket;
