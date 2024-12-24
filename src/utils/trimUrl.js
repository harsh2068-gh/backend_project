const getPublicId = (url) => {
    // Remove the base URL and any versioning
    const parts = url.split('/');
    const fileWithExtension = parts.pop(); // Get the last part of the URL
    const publicId = fileWithExtension.split('.')[0]; // Remove the file extension
    return publicId;
};

// console.log(getPublicId("http://res.cloudinary.com/dyl5fj54k/image/upload/v1735045271/mbblawj4cu2fescakqpc.jpg"))

export default getPublicId