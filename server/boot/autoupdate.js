'use strict';

module.exports = function(app) {
  app.on('started', ()=>{
    app.dataSources.postgres.connector.autoupdate((err)=>{
      if (err) return console.error('autoupdate err', err);
      console.log('autoupdate complete');
    });
  });
};
