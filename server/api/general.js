/**
 * commom R-get list
 * @method list
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @param  {[type]} sort    sort
 * @return {[type]}         [description]
 */
exports.list = async (ctx, mongoDB, sort) => {
    sort = sort || '-_id'
    // get some query msg from ctx
    let { limit, page } = ctx.query
    page = parseInt(page, 10)
    limit = parseInt(limit, 10)
    // some built-in msg
    if (!page) page = 1
    if (!limit) limit = 10
    var skip = (page - 1) * limit
    try {
        // get data from database with db engine mongoDB
        const [list, total] = await Promise.all([
            mongoDB
                .find()
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            mongoDB.countAsync(),
        ])
        //do some caculattion
        var totalPage = Math.ceil(total / limit)
        // return the data with success function on ctx
        // which is built by custom middleware return
        ctx.success({
            list,
            total,
            hasNext: totalPage > page ? 1 : 0,
            hasPrev: page > 1 ? 1 : 0,
        })
    } catch (err) {
        // return the err string with error function on ctx
        // which is built by custom middleware return
        ctx.error(err.toString())
    }
}

/**
 * commom R-get an item
 * @method item
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.item = async (ctx, mongoDB) => {
    // get some query msg from ctx
    const _id = ctx.query.id
    if (!_id) {
        // return the err string with error function on ctx
        // which is built by custom middleware return
        ctx.error('args error')
        return
    }

    try {
        // get data from database with db engine mongoDB
        const result = await mongoDB.findOneAsync({ _id })
        ctx.success(result)
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * commom D-delete an item
 * @method deletes
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.deletes = async (ctx, mongoDB) => {
    const _id = ctx.query.id
    try {
        await mongoDB.updateAsync({ _id }, { is_delete: 1 })
        ctx.success('success', 'delete success')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * commom U-update an item
 * @method modify
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @param  {[type]} _id     [description]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */
exports.modify = async (ctx, mongoDB, _id, data) => {
    try {
        const result = await mongoDB.findOneAndUpdateAsync({ _id }, data, { new: true })
        ctx.success(result, 'update success')
    } catch (err) {
        ctx.error(err.toString())
    }
}

/**
 * commom U-recover an item
 * @method recover
 * @param  {[type]} ctx     [description]
 * @param  {[type]} mongoDB [description]
 * @return {[type]}         [description]
 */
exports.recover = async (ctx, mongoDB) => {
    const _id = ctx.query.id
    try {
        await mongoDB.updateAsync({ _id }, { is_delete: 0 })
        ctx.success('success', 'recover success')
    } catch (err) {
        ctx.error(err.toString())
    }
}
