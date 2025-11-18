import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
	<div>
		<h1>Manage User dashboard</h1>
		{/* dynamic link */}
		<li><Link href="/admin/users/1">User 1</Link></li>
		<li><Link href="/admin/users/2">User 2</Link></li>
		<li><Link href="/admin/users/3">User 3</Link></li>
		<li><Link href="/admin/users/4">User 4</Link></li>
	</div>
  )
}

export default page