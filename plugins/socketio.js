import io from "socket.io-client";

export default ({
  app,
  store
}) => {
  const socket = io();
  store.dispatch('socket_io/init', socket)
}