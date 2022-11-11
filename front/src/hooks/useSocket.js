import io from 'socket.io-client';

const useSocket = () => {
  const socket = io('http://www.groupcalendars.shop');
  socket.on('connection', () => {
    console.log('you are connected');
  });

  return socket;
};

export default useSocket;
