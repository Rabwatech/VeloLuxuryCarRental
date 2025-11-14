import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, MapPin, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';

const steps = [
  { id: 1, title: 'Choose Car & Dates', icon: Calendar },
  { id: 2, title: 'Pickup Details', icon: MapPin },
  { id: 3, title: 'Add Extras', icon: ShieldCheck },
  { id: 4, title: 'Payment', icon: CreditCard },
  { id: 5, title: 'Confirmation', icon: CheckCircle2 },
];

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [bookingId] = useState(`VELO${Math.floor(Math.random() * 1000000)}`);

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-16 mt-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200" style={{ zIndex: 0 }}>
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-gold-light"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-gold to-gold-light'
                        : isCurrent
                        ? 'bg-navy'
                        : 'bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isCompleted ? (
                      <Check size={24} className="text-navy" />
                    ) : (
                      <StepIcon size={24} className={isCurrent ? 'text-gold' : 'text-gray-400'} />
                    )}
                  </motion.div>
                  <p className={`mt-2 text-sm hidden md:block ${isCurrent ? 'text-navy font-semibold' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Step 1: Choose Car & Dates */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl text-navy mb-8" style={{ fontWeight: 700 }}>Choose Your Vehicle & Dates</h2>
              
              <div className="space-y-6">
                <div>
                  <Label>Select Vehicle</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Mercedes CLA 45 AMG - RM1,200/day</SelectItem>
                      <SelectItem value="3">Range Rover Vogue - RM1,800/day</SelectItem>
                      <SelectItem value="5">Lamborghini Huracán - RM3,500/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left mt-2">
                          <Calendar className="mr-2 h-4 w-4 text-gold" />
                          {pickupDate ? format(pickupDate, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={pickupDate} onSelect={setPickupDate} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Drop-off Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left mt-2">
                          <Calendar className="mr-2 h-4 w-4 text-gold" />
                          {dropoffDate ? format(dropoffDate, 'PPP') : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={dropoffDate} onSelect={setDropoffDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pickup/Drop-off Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl text-navy mb-8" style={{ fontWeight: 700 }}>Pickup & Drop-off Details</h2>
              
              <div className="space-y-6">
                <div>
                  <Label>Pickup Location</Label>
                  <Select defaultValue="3towers">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3towers">3 Towers Ampang, Kuala Lumpur</SelectItem>
                      <SelectItem value="klia">KLIA Airport</SelectItem>
                      <SelectItem value="custom">Custom Location (RM150 delivery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Drop-off Location</Label>
                  <Select defaultValue="3towers">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3towers">3 Towers Ampang, Kuala Lumpur</SelectItem>
                      <SelectItem value="klia">KLIA Airport</SelectItem>
                      <SelectItem value="custom">Custom Location (RM150 delivery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-light p-6 rounded-xl mt-8">
                  <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                    <MapPin size={48} className="text-gold" />
                  </div>
                  <p className="text-center mt-4 text-gray-600">Map Preview: 3 Towers Ampang</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Add Extras */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl text-navy mb-8" style={{ fontWeight: 700 }}>Enhance Your Experience</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-gray-light rounded-xl hover:bg-gold/10 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <Checkbox id="chauffeur" className="mt-1" />
                    <div>
                      <Label htmlFor="chauffeur" className="cursor-pointer">Professional Chauffeur Service</Label>
                      <p className="text-gray-600 text-sm mt-1">Sit back and enjoy the ride with our experienced drivers</p>
                    </div>
                  </div>
                  <span className="text-navy" style={{ fontWeight: 600 }}>+RM500/day</span>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-light rounded-xl hover:bg-gold/10 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <Checkbox id="insurance" className="mt-1" />
                    <div>
                      <Label htmlFor="insurance" className="cursor-pointer">Premium Insurance Coverage</Label>
                      <p className="text-gray-600 text-sm mt-1">Additional protection and peace of mind</p>
                    </div>
                  </div>
                  <span className="text-navy" style={{ fontWeight: 600 }}>+RM200/day</span>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-light rounded-xl hover:bg-gold/10 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <Checkbox id="delivery" className="mt-1" defaultChecked />
                    <div>
                      <Label htmlFor="delivery" className="cursor-pointer">VIP Delivery & Collection</Label>
                      <p className="text-gray-600 text-sm mt-1">White-glove service to your doorstep</p>
                    </div>
                  </div>
                  <span className="text-navy" style={{ fontWeight: 600 }}>+RM300</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-3xl text-navy mb-8" style={{ fontWeight: 700 }}>Secure Payment</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name</Label>
                    <Input type="text" placeholder="Dato' Ahmad Rahman" className="mt-2" />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="ahmad@example.com" className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input type="tel" placeholder="+60 12-345 6789" className="mt-2" />
                </div>

                <div className="border-t border-gray-200 pt-6 mt-8">
                  <Label>Payment Method</Label>
                  <Select defaultValue="fpx">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fpx">FPX Online Banking</SelectItem>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-navy text-white p-6 rounded-xl mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <span>Base Rate (3 days)</span>
                    <span>RM5,400</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span>VIP Delivery</span>
                    <span>RM300</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/20">
                    <span>Insurance</span>
                    <span>RM600</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl" style={{ fontWeight: 700 }}>Total</span>
                    <span className="text-3xl text-gold" style={{ fontWeight: 700 }}>RM6,300</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8" />
                  <span className="text-gray-500">Secure payment powered by FPX</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gold to-gold-light rounded-full mb-8"
              >
                <CheckCircle2 size={48} className="text-navy" />
              </motion.div>

              <h2 className="text-4xl text-navy mb-4" style={{ fontWeight: 700 }}>Booking Confirmed!</h2>
              <p className="text-xl text-gray-600 mb-8">Your luxury experience awaits</p>

              <div className="bg-gray-light p-8 rounded-xl mb-8 max-w-md mx-auto">
                <p className="text-gray-600 mb-2">Your Booking ID</p>
                <p className="text-3xl text-navy mb-6" style={{ fontWeight: 700 }}>{bookingId}</p>
                
                <div className="text-left space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span className="text-navy" style={{ fontWeight: 600 }}>Range Rover Vogue 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span className="text-navy" style={{ fontWeight: 600 }}>Nov 1, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop-off:</span>
                    <span className="text-navy" style={{ fontWeight: 600 }}>Nov 4, 2025</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-300">
                    <span>Total Paid:</span>
                    <span className="text-gold text-xl" style={{ fontWeight: 700 }}>RM6,300</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to your email address.<br />
                Our team will contact you within 24 hours.
              </p>

              <Button
                onClick={() => window.open('https://wa.me/60123456789', '_blank')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6 rounded-lg hover:shadow-xl transition-all duration-300"
                style={{ fontWeight: 600 }}
              >
                Contact Us on WhatsApp
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8"
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-gold to-gold-light text-navy px-8 hover:shadow-xl transition-all duration-300"
              >
                {currentStep === 4 ? 'Complete Payment' : 'Continue'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
