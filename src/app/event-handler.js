function handleNodeEvent(serverApp, mongoose) {
  // Begin reading from stdin so the process does not exit.
  process.stdin.resume();
  // catch the uncaught errors that weren't wrapped in a domain or try catch statement
  // do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
  process.on('unhandledRejection', function(reason, promise) {
    // handle the error safely
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception');
    console.error(err.stack);
  });

  // 'SIGINT' signal generated with <Ctrl>+C in the terminal
  process.on('SIGINT', signalName => {
    console.info(`${ signalName } signal received.`);
    stopServer(serverApp, mongoose);
  });
}

function stopServer(server, mongoose) {
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    // boolean means [force], see in mongoose doc
    mongoose.connection.close(false, () => {
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  });
}

export default handleNodeEvent;
