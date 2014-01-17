_.defer => Order.sync()

class GLOBAL.Order extends ModelAbstract

  @ttl: 1000 * 60 * 60 * 24

  @db_key: 'orders'
