# ensure directory
fs = require('fs')
try fs.mkdirSync('models/data')

crypto = require 'crypto'

# @ symbol compiles to this.
class GLOBAL.ModelAbstract


  # instance methods are keys
  
  # We can set defaults in arguments
  constructor: (@attributes = {}) ->

    # We pull out id from attributes for ease of use
    {@id} = @attributes
    unless @id
      @attributes.id = @id = crypto.randomBytes(10).toString('hex')

  sanitize_url: require('../lib/sanitize_url');

  save: ->

    if existing = _.findWhere @constructor.collection, {@id}
      _.extend existing, @attributes
    else
      @constructor.collection.push @attributes

    @constructor.write_to_disk()


  destroy: ->
    if (i = @constructor.collection.indexOf(this)) isnt -1
      @constructor.collection.splice i, 1

    @constructor.write_to_disk()

  # class methods are @keys
  #
  @find: (id) ->

    if (record = _.findWhere @collection, {id})?
      new this(record)

  @get_path: -> "models/data/#{@db_key}.txt"

  @sync: ->
    try
      @collection = JSON.parse fs.readFileSync(@get_path()).toString()
    catch er
      @collection = []

  @write_to_disk: ->
    fs.writeFileSync @get_path(), JSON.stringify(@collection)
