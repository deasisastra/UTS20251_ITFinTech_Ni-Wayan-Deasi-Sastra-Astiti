export function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MongoDB URI is not defined in environment variables');
  }
  return uri.startsWith('"') ? uri.slice(1, -1) : uri;
}