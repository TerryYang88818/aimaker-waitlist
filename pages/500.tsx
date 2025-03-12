export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            500 - Server-side error occurred
          </h1>
          <p className="text-gray-600">
            We're sorry, but something went wrong on our end.
          </p>
        </div>
      </div>
    </div>
  )
} 