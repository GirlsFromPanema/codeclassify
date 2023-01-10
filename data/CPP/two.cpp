#include "includes.h"

namespace AMQP
{

    /**
     *  Constructor based on incoming frame
     *  @param  frame
     */
    Array::Array(InBuffer &frame)
    {
        // use this to see if we've read too many bytes.
        uint32_t charsToRead = frame.nextUint32();

        // keep going until all data is read
        while (charsToRead > 0)
        {
            // one byte less for the field type
            charsToRead -= 1;

            // read the field type and construct the field
            auto field = Field::decode(frame);
            if (!field)
                continue;

            // less bytes to read
            charsToRead -= (uint32_t)field->size();

            // add the additional field
            _fields.push_back(std::move(field));
        }
    }
}