_.defer => Lunch.sync()

class GLOBAL.Lunch extends ModelAbstract

  @ttl: 1000 * 60 * 60 * 24

  @db_key: 'lunches'

  findOrders: ->
    Order.where {lunch_id: @id}

  getLunchRestaurants: ->
    LunchRestaurant.where {lunch_id: @id}

  getRestaurant: ->
    Restaurant.find @attributes.restaurant_id

  save: ->
    @attributes.menu_url = @sanitize_url @attributes.menu_url
    super
