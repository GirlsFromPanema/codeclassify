module Son.Generator where

import Data.Aeson
import Data.Char (intToDigit)
import Data.HashMap.Strict (HashMap)
import Data.Scientific (Scientific)
import Data.String (String)
import Data.Text.Lazy.Builder (Builder)
import Data.Vector (Vector)
import Protolude

import qualified Data.HashMap.Strict as HM
import qualified Data.Scientific as Sci
import qualified Data.Text as T
import qualified Data.Text.Lazy as TL
import qualified Data.Text.Lazy.Builder as TB

generateSon :: Value -> Text
generateSon = TL.toStrict . TB.toLazyText . genValue

genValue :: Value -> Builder
genValue (Object hm)  = genObject hm
genValue (Array xs)   = genArray xs
genValue (String s)   = genString s
genValue (Number n)   = genNumber n
genValue (Bool True)  = "true"
genValue (Bool False) = "false"
genValue Null         = "null"

genObject :: HashMap Text Value -> Builder
genObject hm = "{" <> foldl' addMember mempty sortedMembers <> "}"
  where
    sortedMembers :: [(Text, Value)]
    sortedMembers = sortOn fst (HM.toList hm)

    addMember :: Builder -> (Text, Value) -> Builder
    addMember a (k,v)
      | a == mempty = pair
      | otherwise   = a <> "," <> pair
      where
        pair :: Builder
        pair = genString k <> ":" <> genValue v

genArray :: Vector Value -> Builder
genArray xs = "[" <> foldl' addElement mempty xs <> "]"
  where
    addElement :: Builder -> Value -> Builder
    addElement a v
      | a == mempty = genValue v
      | otherwise   = a <> "," <> genValue v
