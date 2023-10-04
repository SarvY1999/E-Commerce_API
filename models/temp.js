[
    {
        '$match': {
            'product': new ObjectId('64db83dfb34ab365e1fde3dc')
        }
    }, {
        '$group': {
            '_id': null,
            'averageRating': {
                '$avg': '$rating'
            },
            'numOfReviews': {
                '$sum': 1
            }
        }
    }
]