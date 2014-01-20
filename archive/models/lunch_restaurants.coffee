_.defer => LunchRestaurant.sync()

class GLOBAL.LunchRestaurant extends ModelAbstract

  @db_key: 'lunch_restaurants'

  getRestaurant: ->
    console.log @attributes
    Restaurant.find @attributes.restaurant_id

  getLunch: ->
    Lunch.find @attributes.lunch_id
