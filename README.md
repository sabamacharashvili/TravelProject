ესეიგი გასაკეთებელია:

ბექი :
1.ჯობია რომ ცოტა სწორი სახელები დაარქვა ფაილებს,მაგალითად booking.js -ის მაგივრად tours.js ან toursModel.js
ანუ შეცვალე booking.js მოდელი tours.js ან toursModel.js -ად .

2.როდესაც შეცვლი, user-ის მოდელში დაამატე რეფერენსი ტურებზე რომელზეც არის დაჯოინებული და ასევე რომელი ტურებიც აქვს შექმნილი

user-ის მოდელი
tour: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "Tour",
},
],

toursCreated: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "Tour",
},
],

და ასევე tour -ის მოდელში დაამატე რეფერენსი იუზერებზე და ასევე ველი creator - ანუ ვინ შექმნა ტური

tour -ის მოდელი
user: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
],

creator :{
type: mongoose.Schema.Types.ObjectId,
ref: "User",
}

ეს გვჭირდება იმისთვის რომ მხოლოდ creator-ს შეეძლოს თავისი ტურის წაშლა

3.რაც შეეხება routes და controllers, შექმენი authRoute.js და authController.js ფაილები და მანდ გაიტანე login და register ფუნქციები,რომლებიც ახლა გიწერია userController-ში.

userController და userRoute გამოიყენე user -ის ინფორმაციების წამოსაღბად და იუზერის სხვა მოქმედებებისთვის მაგალითად:

getAllUser (თუ გინდა)
getUserInfo, (იუზერის ინფორმაციის წამოღება. აქ დაგჭირდება populate რომ ეს იუზერი რომელ ტურებზეც არის დაჯოინებული ის ტურებიც წამოიღო და ასევე თვითონ რომელი ტურები შექმნა )
createTour, (ტურის შექმნა, ანუ იუზერს უნდა შეეძლოს ტურის შექმნა)
deleteTour, (ტურის წაშლა, ანუ იუზერს უნდა შეეძლოს მხოლოდ იმ ტურის წაშლა რომელიც თვითონ შექმნა)
joinTour (იუზერის ტურზე დაჯოინება)
cancelJoin (რეგისტრაციის გაუქმება )

4.tourController და tourRoute გამოიყენე tour -ის ინფორმაციების წამოსაღბად,მაგალითად:

getAllTour, (ყველა ტურის წამოღება)
getOneTour, (ერთი ტურის წამოღება. აქ დაგჭირდება populate რომ ამ ტურის იუზერებიც წამოიღო და ვინ შექმნა ეგეც)
