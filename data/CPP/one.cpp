Array::Array(const Array &array)
{
    // loop through the other array
    for (auto iter = array._fields.begin(); iter != array._fields.end(); iter++)
    {
        // add to this vector
        _fields.push_back((*iter)->clone());
    }
}

/**
 *  Get a field
 *
 *  If the field does not exist, an empty string is returned
 *
 *  @param  index   field index
 *  @return Field
 */
const Field &Array::get(uint8_t index) const
{
    // used if index does not exist
    static ShortString empty;

    // check whether we have that many elements
    if (index >= _fields.size())
        return empty;

    // get value
    return *_fields[index];
}

/**
 *  Number of entries in the array
 *  @return uint32_t
 */
uint32_t Array::count() const
{
    return (uint32_t)_fields.size();
}

/**
 *  Remove a field from the array
 */
void Array::pop_back()
{
    _fields.pop_back();
}