async function testLogin() {
  const res = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'login',
      name: '管理者太郎',
      password: 'nusc'
    })
  })
  
  const data = await res.json()
  console.log('Status:', res.status)
  console.log('Data:', data)
  console.log('Cookies:', res.headers.get('set-cookie'))
}

testLogin().catch(console.error)
