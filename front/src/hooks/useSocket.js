import io from 'socket.io-client';

const useSocket = () => {
  const socket = io('http://localhost:80');
  socket.on('connect');

  //   const disconnect = useCallback(() => {
  //     socket.on('disconnect');
  //   });

  return socket;
};

export default useSocket;
