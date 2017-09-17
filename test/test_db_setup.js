before(function(){
    console.log('executing before');
    return require('../bin/init_test_db');
});

after(function(){
   return require('../bin/drop_db');
});

