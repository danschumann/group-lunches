_.defer => Lunch.sync()

class GLOBAL.Lunch extends ModelAbstract

  @db_key: 'lunches'

  # get all orders in parallel
  findOrders: (done) ->

    _.where Order.collection, {lunch_id: @id}

  save: ->
    @attributes.menu_url = @sanitize_url @attributes.menu_url
    super
