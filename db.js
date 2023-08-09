const mongoose = require('mongoose')
const mongoURI = 'mongodb+srv://amishpratapsingh13:amish1361@cluster0.lkj7okx.mongodb.net/bhojanmern?retryWrites=true&w=majority'


const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true });
        console.log('Connected to MongoDB');

        const fetchedDataPromise = mongoose.connection.db.collection('food_items').find({}).toArray();
        const foodCategoryPromise = mongoose.connection.db.collection('foodCategory').find({}).toArray();

        const [data, catData] = await Promise.all([fetchedDataPromise, foodCategoryPromise]);

        global.food_items = data;
        global.foodCategory = catData;

        console.log('Data fetched successfully!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
};

module.exports = mongoDB