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
    @attributes.timestamp ?= (new Date).getTime()

  sanitize_url: require('../lib/sanitize_url');

  save: ->

    if existing = _.findWhere @constructor.collection, {@id}
      _.extend existing, @attributes
    else
      @constructor.collection.push @attributes

    @constructor.write_to_disk()


  destroy: ->
    if (i = @constructor.collection.indexOf(@attributes)) isnt -1
      @constructor.collection.splice i, 1

    @constructor.write_to_disk()

  # class methods are @keys
  #
  @where: (options) ->
    _.where @collection, options

  @find: (id) ->

    if record = @where({id})?[0]
      new this(record)

  @get_path: -> "models/data/#{@db_key}.txt"

  # Sync is ran once by every collection
  @sync: ->
    try
      @collection = JSON.parse fs.readFileSync(@get_path()).toString()
    catch er
      @collection = []

    #making it the perfect place to start this
    if @ttl
      setInterval (=> @delete_old()), 100#0 * 60 * 5

  @write_to_disk: ->
    fs.writeFileSync @get_path(), JSON.stringify(@collection)

  @delete_old: ->
    n = 0
    now = (new Date).getTime()
    deleted_one = false
    while n < @collection.length
      if @collection[n].timestamp + @ttl < now
        @collection.splice n, 1
        deleted_one = true
      else
        n++

    @write_to_disk() if deleted_one

