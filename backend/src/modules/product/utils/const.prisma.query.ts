export const productSelect = {
  id: true,
  name: true,
  description: true,
  stock: true,
  price: true,
  isAvailable: true,
  imageUrl: true, 
  category: { select: { id:true, name: true } },
  storageUnit: { select: { id:true, name: true, unit: true } },
}