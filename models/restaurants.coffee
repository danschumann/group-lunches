_.defer => Restaurant.sync()

class GLOBAL.Restaurant extends ModelAbstract

  @db_key: 'restaurants'

  save: ->
    @attributes.url = @sanitize_url @attributes.url
    super
