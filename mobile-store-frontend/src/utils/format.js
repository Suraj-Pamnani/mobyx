export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
};

export const calculateDiscountedPrice = (price, discount) => {
  if (!discount || discount <= 0) return price;
  return price - (price * (discount / 100));
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const truncateText = (text, limit) => {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

export const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
