const pad = (num) => (num < 10 ? ('0' + num) : num)

const formatYear = (fullYear) => fullYear === (new Date()).getFullYear() ? '' : `.${ fullYear }`

const formatDate = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}${ formatYear(date.getFullYear()) }`

const formatTime = (date) => ['getHours', 'getMinutes', 'getSeconds'].map((fnName) => pad(date[fnName]())).join(':')

const withDate = (date, handler) => handler(new Date(date))

const formatScopeDate = (date) => withDate(date, (dateObj) =>`${formatDate(dateObj)} ${formatTime(dateObj)}`)

export default formatScopeDate
