export const database = {
  'development': {
    'sql' : {
        'username': '',
        'password': '',
        'database': '',
        'host': '',
        'dialect' : '',
        'logging' : true,
        'define'  : {
          'timestamps' : false
        }
    },
    'no_sql' : {
        'username': '',
        'password': '',
        'database': '',
        'host': '',
        'dialect' : ''
    }
  },
  'stage': {
    'sql' : {
        'username': '',
        'password': null,
        'database': '',
        'host': '',
        'dialect' : '',
        'logging' : true,
        'define'  : {
          'timestamps' : false
        }
    }
  },
  'production': {
    'sql' : {
        'username': '',
        'password': '',
        'database': '',
        'host': '',
        'dialect' : '',
        'logging' : false,
        'define'  : {
          'timestamps' : false
        }
    },
    'no_sql' : {
        'username': '',
        'password': '',
        'database': '',
        'host': '',
        'dialect' : ''
    }
  }
};

