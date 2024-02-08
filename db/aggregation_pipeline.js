[
    {
      '$match': {
        'product': new ObjectId('64a9510f447bbe873a55d9ab')
      }
    }, {
      '$group': {
        '_id': null, 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'numberOfReviews': {
          '$sum': 1
        }
      }
    }
]