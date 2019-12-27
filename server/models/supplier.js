'use strict';

module.exports = function(Supplier) {
  Supplier.list = function(options, callback) {
    let connector = Supplier.getDataSource().connector;
    let sql = 'select * from Supplier';
    connector.execute(sql, [], options, (err, results)=>{
      if (err) return callback(err);
      callback(null, results);
    });
  };

  Supplier.remoteMethod(
    'list',
    {
      isStatic: true,
      accepts: [
        {arg: 'options', type: 'object', http: 'optionsFromRequest'},
      ],
      returns: {arg: 'results', type: 'array', root: true},
      http: {verb: 'get'},
    }
  );
};
