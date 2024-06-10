export default function Page({ params }: { params: { businessId: string } }) {
    return <div>My Post: {params.businessId}</div>
}