const ContactCards = ({ contactList }) => {
  return (
    <>
      {contactList?.map((contact, index) => (
        <figure className="" key={index}>
          {/*<img alt="user" className="w-32 h-32 rounded-full mx-auto mt-7" src={contact.picture.large} />*/}
          <figcaption className="text-center">
            <p className="text-gray-700 font-semibold text-xl mb-2">
              {contact.name}
            </p>
            <p className="text-gray-500">
              <span className="font-medium">gecko id: </span>{contact.gecko_id}
            </p>
            {/*<p className="text-gray-500">*/}
            {/*  <span className="font-medium">phone: </span>{contact.cell}*/}
            {/*</p>*/}
            {/*<p className="text-gray-500">*/}
            {/*  <span className="font-medium">city: </span>{contact.location.city}*/}
            {/*</p>*/}
          </figcaption>
        </figure>
      ))}
    </>
  )
}

export default ContactCards