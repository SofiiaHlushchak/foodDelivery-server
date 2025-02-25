import mongoose from "mongoose";

const paymentCardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
            validate: {
                validator: (v) => /^[0-9]{16}$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid card number! Card number should be exactly 16 digits.`,
            },
        },
        expirationDate: {
            type: String,
            required: true,
            validate: {
                validator: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
                message: (props) =>
                    `${props.value} is not a valid expiration date! The expiration date should be in the format MM/YY.`,
            },
        },
    },
    { timestamps: true }
);

const PaymentCard = mongoose.model("PaymentCard", paymentCardSchema);

export default PaymentCard;
